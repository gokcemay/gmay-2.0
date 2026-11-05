CREATE OR REPLACE FUNCTION public.cast_vote(figure_id text, voter_id uuid, vote smallint, note text DEFAULT NULL) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE recent timestamptz[]; stamp timestamptz := clock_timestamp();
BEGIN
 IF figure_id IS NULL OR figure_id !~ '^p[0-9]{4}-[0-9]{2}$' OR voter_id IS NULL OR vote IS NULL OR vote NOT IN (-1,0,1) OR char_length(note)>280 THEN RAISE EXCEPTION 'Invalid vote'; END IF;
 IF figure_id = ANY(ARRAY['p0148-01','p0205-15','p0222-10','p0224-07','p0276-02','p0276-03','p0276-05','p0277-03','p0277-04','p0277-05','p0278-05','p0279-04','p0281-04','p0283-01','p0286-01','p0296-03','p0305-03','p0321-03','p0321-04','p0323-03','p0327-02','p0327-04','p0354-01','p0382-01']) THEN RAISE EXCEPTION 'Model is not eligible for voting'; END IF;
 INSERT INTO public.model_vote_limits(voter_id) VALUES(cast_vote.voter_id) ON CONFLICT DO NOTHING;
 SELECT l.events INTO recent FROM public.model_vote_limits l WHERE l.voter_id=cast_vote.voter_id FOR UPDATE;
 SELECT ARRAY(SELECT e FROM unnest(recent) e WHERE e > stamp - interval '1 minute') INTO recent;
 IF cardinality(recent)>=30 THEN RAISE EXCEPTION 'Vote limit reached'; END IF;
 UPDATE public.model_vote_limits l SET events=array_append(recent,stamp) WHERE l.voter_id=cast_vote.voter_id;
 IF vote=0 THEN DELETE FROM public.model_votes v WHERE v.figure_id=cast_vote.figure_id AND v.voter_id=cast_vote.voter_id;
 ELSE INSERT INTO public.model_votes(figure_id,voter_id,vote,note) VALUES(cast_vote.figure_id,cast_vote.voter_id,cast_vote.vote,CASE WHEN vote=-1 THEN nullif(trim(note),'') ELSE NULL END) ON CONFLICT ON CONSTRAINT model_votes_pkey DO UPDATE SET vote=excluded.vote,note=excluded.note,updated_at=stamp; END IF;
END $$;