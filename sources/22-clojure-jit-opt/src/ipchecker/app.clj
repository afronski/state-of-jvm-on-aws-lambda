(ns ipchecker.app
  (:gen-class
   :methods [^:static [handler [Object] Object]])
  (:require [cheshire.core :as json]
            [clj-http.client :as client]
            [clojure.string :as str]))

(def lambda_default
  {"isBase64Encoded" false
   "headers" {"Content-Type" "application/json"}
   "statusCode" 200})

(defn -handler
  [event]
  (letfn [(checkIp
           []
           (str/trim (get (client/get "https://checkip.amazonaws.com") :body)))
         ]
    (merge lambda_default {"body" (json/generate-string {"ip" (checkIp)})})))