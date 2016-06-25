build:
	webpack
	cp src/index.html dist/index.html
	cp src/main.css dist/main.css

run:
	http-server dist/

test:
	echo "go on then"
