(ns ip-checker.core
  (:gen-class)
  (:require [fierycod.holy-lambda.response :as hr]
            [fierycod.holy-lambda.core :as h]
            [clj-http.lite.client :as client]
            [clojure.string :as str]))

(defn check-ip
  []
  (str/trim (get (client/get "https://checkip.amazonaws.com") :body)))

(defn CheckIPLambda
  [{:keys [event ctx] :as request}]
  (hr/json {"ip" (check-ip)}))

(h/entrypoint [#'CheckIPLambda])
