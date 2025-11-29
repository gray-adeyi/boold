fmt-frontend:
	$(MAKE) -C frontend fmt
fmt-backend:
	go fmt ./...
fmt-all: fmt-frontend fmt-backend
install-hooks: install-pre-commit-hook
uninstall-hooks: uninstall-pre-commit-hook
install-pre-commit-hook:
	cp ./scripts/run-pre-commit-hook.sh .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit
	@echo "pre-commit hook installed!"
uninstall-pre-commit-hook:
	rm -f .git/hooks/pre-commit
	@echo "pre-commit hook uninstalled!"	
reset-hooks:
	rm -f .git/hooks/pre-commit
	# rm -f .git/hooks/pre-push
	# rm -f .git/hooks/commit-msg
	# @echo "all git hooks removed!"
