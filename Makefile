all: install

install:
	python -m virtualenv .env --python=python3
	.env/bin/python -m pip install -r requirements.txt
	npm install --global npm
	npm install --global typescript aws-cdk eslint yarn

clean:
	rm -rf .env/
