build:
	@docker build -t fall-surveilance-notification . 
run:
	@docker run -p 4000:4000 fall-surveilance-notification