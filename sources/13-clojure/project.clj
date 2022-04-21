(defproject ip-checker "1.0.0"
  :dependencies [[org.clojure/clojure "1.10.1"]
                 [com.amazonaws/aws-lambda-java-core "1.2.1"]
                 [cheshire "5.9.0"]
                 [clj-http "3.12.3"]
                ]

  :java-source-paths ["src/java"]
  :main ipchecker.app

  :profiles {:uberjar {:aot :all
                       :global-vars {*warn-on-reflection* true}
                      }
            }
)