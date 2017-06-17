deploy:
	tar --exclude='frontend/node_modules' --exclude='vendor' --exclude='.dub' \
		--exclude='hapen.tgz' --exclude='.git' --exclude='source' \
		--exclude='frontend/src' -zcvf hapen.tgz .
	scalingo --app scalingo-d-test happen.tgz
