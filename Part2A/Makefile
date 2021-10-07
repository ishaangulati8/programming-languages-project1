.PHONY: clean run install
run: clean install 
	@node index.js $(json)
clean:
	rm -rf *sql *.dsl node_modules

node_modules: package.json
	npm install

install: node_modules
