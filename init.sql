
CREATE TABLE public.newtable (
	url varchar NOT NULL,
	file_name varchar NOT NULL,
	bytes bytea NULL,
	CONSTRAINT newtable_pk PRIMARY KEY (file_name)
);

