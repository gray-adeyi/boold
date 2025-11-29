fmt-frontend:
	$(MAKE) -C frontend fmt
fmt-backend:
	go fmt ./...
fmt-all: fmt-frontend fmt-backend