CREATE TABLE public.model_votes (figure_id text NOT NULL CHECK (figure_id ~ '^p[0-9]{4}-[0-9]{2}$'), voter_id uuid NOT NULL, vote smallint NOT NULL CHECK (vote IN (1,-1)), note text CHECK (char_length(note) <= 280), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (figure_id,voter_id));
GRANT ALL ON public.model_votes TO service_role;
REVOKE ALL ON public.model_votes FROM anon, authenticated;
ALTER TABLE public.model_votes ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.model_vote_limits (voter_id uuid PRIMARY KEY, events timestamptz[] NOT NULL DEFAULT '{}');
GRANT ALL ON public.model_vote_limits TO service_role;
REVOKE ALL ON public.model_vote_limits FROM anon, authenticated;
ALTER TABLE public.model_vote_limits ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.cast_vote(figure_id text, voter_id uuid, vote smallint, note text DEFAULT NULL) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE recent timestamptz[]; stamp timestamptz := clock_timestamp();
BEGIN
 IF figure_id IS NULL OR figure_id !~ '^p[0-9]{4}-[0-9]{2}$' OR voter_id IS NULL OR vote IS NULL OR vote NOT IN (-1,0,1) OR char_length(note)>280 THEN RAISE EXCEPTION 'Invalid vote'; END IF;
 INSERT INTO public.model_vote_limits(voter_id) VALUES(cast_vote.voter_id) ON CONFLICT DO NOTHING;
 SELECT ARRAY(SELECT e FROM unnest(l.events) e WHERE e > stamp - interval '1 minute') INTO recent FROM public.model_vote_limits l WHERE l.voter_id=cast_vote.voter_id FOR UPDATE;
 IF cardinality(recent)>=30 THEN RAISE EXCEPTION 'Vote limit reached'; END IF;
 UPDATE public.model_vote_limits l SET events=array_append(recent,stamp) WHERE l.voter_id=cast_vote.voter_id;
 IF vote=0 THEN DELETE FROM public.model_votes v WHERE v.figure_id=cast_vote.figure_id AND v.voter_id=cast_vote.voter_id;
 ELSE INSERT INTO public.model_votes(figure_id,voter_id,vote,note) VALUES(cast_vote.figure_id,cast_vote.voter_id,cast_vote.vote,CASE WHEN vote=-1 THEN nullif(trim(note),'') ELSE NULL END) ON CONFLICT ON CONSTRAINT model_votes_pkey DO UPDATE SET vote=excluded.vote,note=excluded.note,updated_at=stamp; END IF;
END $$;
REVOKE ALL ON FUNCTION public.cast_vote(text,uuid,smallint,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cast_vote(text,uuid,smallint,text) TO anon, authenticated;
CREATE OR REPLACE FUNCTION public.vote_counts() RETURNS TABLE(figure_id text, correct bigint, incorrect bigint) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$ SELECT v.figure_id,count(*) FILTER(WHERE vote=1),count(*) FILTER(WHERE vote=-1) FROM public.model_votes v GROUP BY v.figure_id $$;
REVOKE ALL ON FUNCTION public.vote_counts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.vote_counts() TO anon, authenticated;
CREATE VIEW public.model_vote_export WITH (security_invoker=true) AS SELECT figure_id,count(*) FILTER(WHERE vote=1) AS correct,count(*) FILTER(WHERE vote=-1) AS incorrect,string_agg(note,E'\n' ORDER BY updated_at) FILTER(WHERE vote=-1 AND note IS NOT NULL) AS notes FROM public.model_votes GROUP BY figure_id;
REVOKE ALL ON public.model_vote_export FROM anon, authenticated;
GRANT SELECT ON public.model_vote_export TO service_role;