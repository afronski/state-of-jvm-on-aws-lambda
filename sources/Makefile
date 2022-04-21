all: install

install: java8 java11 clj 																						 \
				 java11-jit-opt clj-jit-opt clj-custom-runtime								 \
				 java11-graalvm clj-graalvm

clean: clean-java8 clean-java11 clean-clj														   \
			 clean-java11-jit-opt clean-clj-jit-opt clean-clj-custom-runtime \
		   clean-java11-graalvm clean-clj-graalvm

java8:
	cd 11-java-8 && ./gradlew build

clean-java8:
	cd 11-java-8 && ./gradlew clean

java11:
	cd 12-java-11 && ./gradlew build

clean-java11:
	cd 12-java-11 && ./gradlew clean

clj:
	cd 13-clojure && lein uberjar

clean-clj:
	cd 13-clojure && lein clean

java11-jit-opt:
	cd 21-java-11-jit-opt && ./gradlew build

clean-java11-jit-opt:
	cd 21-java-11-jit-opt && ./gradlew clean

clj-jit-opt:
	cd 22-clojure-jit-opt && lein uberjar

clean-clj-jit-opt:
	cd 22-clojure-jit-opt && lein clean

clj-custom-runtime:
	cd 23-clojure-custom-runtime && bb hl:babashka:sync
	cd 23-clojure-custom-runtime && bb hl:compile

clean-clj-custom-runtime:
	cd 23-clojure-custom-runtime && bb hl:clean

java11-graalvm:
	cd 31-java-11-graalvm && mvn clean install -P native-image

clean-java11-graalvm:
	cd 31-java-11-graalvm && mvn clean -P native-image

clj-graalvm:
	cd 32-clojure-graalvm && bb hl:babashka:sync
	cd 32-clojure-graalvm && bb hl:compile
	cd 32-clojure-graalvm && bb hl:native:executable

clean-clj-graalvm:
	cd 32-clojure-graalvm && bb hl:clean
