CREATE TABLE IF NOT EXISTS cars
(
    "number" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    validity_period bigint NOT NULL,
    category text COLLATE pg_catalog."default" NOT NULL,
    price bigint NOT NULL,
    service_life bigint NOT NULL,
    CONSTRAINT car_pkey PRIMARY KEY ("number")
);

CREATE TABLE IF NOT EXISTS email_confirmation
(
    email text COLLATE pg_catalog."default" NOT NULL,
    "time" integer NOT NULL,
    pin integer NOT NULL,
    CONSTRAINT email_confirmation_pkey PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS users
(
    id bigserial NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    surname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    patronymic character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    number_car character varying(255) COLLATE pg_catalog."default" DEFAULT 'none'::character varying,
    number_fines integer DEFAULT 0,
    spent_fines integer DEFAULT 0,
    status character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT 'driver'::character varying,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);