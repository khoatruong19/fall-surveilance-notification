build:
	@docker build -t fall-surveilance-notification . 
run:
	@docker run -p 3000:3000 fall-surveilance-notification