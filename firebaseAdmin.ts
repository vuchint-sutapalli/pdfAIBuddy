// import { initializeApp } from "firebase-admin";
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceKey from "./service_key.json";

// let serviceAccount = require("/service_key.json");

// const serviceKey = require("@/service_key.json");

let app: App;
if (getApps().length == 0) {
  app = initializeApp({
    credential: cert({
      projectId: "chat-with-pdf-9cc9d",
      privateKey:
        "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQChePcqad/0UULv\nCT6ZQDNzVg13kLQC/KnjqHF9FIbVgXwK2wrUoi2U1pbELuEUTjM0NmXbw/c6LVPH\nC5jH5c9s7e/zzFpr+WkLIob0l5BssMpBBu36NailZFgEfODiV8KNcEd9re2iXOCS\nu7W3HeICddhAoh2YZGQtQYWysnPjeBJ3XlTuwn9HcWkxZMU4wNkUJ7m8ASw4/Qyp\noVqiNJliOBXruFUg7GvAtqbS5N87LdGs0IhknaHHxsuL6J2PZdIO9Ejo9gOgXHSe\n85gmxHk1xdHhFGbCHwQKBoL2+PV7od27bunJpRnoukojCIYCYjT0S5GVUOn+Glxo\noBvw/I+/AgMBAAECggEAEuZsz9saqqdEVWRYnmmEXDCrXN5kI6FdZVdXCVP4wE7q\nrP6ckuz0tuIzPX1bPRw2JBtl6sZSTs31a2vxExzUHaTwHDJENzU3VWVSNJj0/7Pl\nyJy+CDZ1qf5Hyyauz++DxzhoNc7A7OtAIgy0pV1rEeynRlFzc13019M+if8XT32T\n2KRfNT3VnDQh5UChViIujROnEVYPJV2aUt4c7LqMZdGjCCM0mWr88B5rknK+tsll\n1AOu9EWX4vj3xaNwtt1949xhc3xXw+IEnA48AIjoTIezWsJZfz+ekA/1ggFq/KMb\nR4OEuFkBz5GF7v0Xr25FqaWyVYKr4AjieTxP4mA7oQKBgQDPfb/HnH6axEP4mVNx\ntXUPPkMmSD2cnI8HGfiGK18XxfQRGTDuzTmCftqn3fQnAX2f+pne07tYw01nguxc\nTiU5LV8nXltRyQBDCoAbQOx3hr2yh7qLQI49r8KNPdwLF4kOZ3A+dVfRnV/zD8Hg\nfH7rl6EgNxF8h3k32OSVUzcF0QKBgQDHOQULNxC0Sbf/ty/GjjmT3RgyxcoE5qiR\nPhUp77F1t7JaZZfk/OkyPT30ULzA2d9LpWowwltjdoM+gRXwneu0s7hDBLiN/eEQ\n+PlgTitGwASwXszzUGduwrQsHxF4Fqtzf/P7dgRkRk1xDitKxA/nBB3g9Wy8CCy5\nCAwdxT9QjwKBgQCbT+Vd5SZfcsnuK9bqJomY/2IEJc74i7gD+MyuoYhsoyAuLE0U\nc0m5BHtnbBx1lggS1+KViKeTqZ0m/jkuXtA+HFg9f8ObVHl9tT5vKAnY7mLQYAii\nc5AFXKqkTsmHA/bzcTnzhqJVpRdNOV5GSuo2LynMk2vjawSxaQixPbjSAQKBgGxY\nrE+PIPyL4w+lVsxLaTDrW0+xlc7YivCCrQvjmcWFo+/ZtKQKj+CMwfbvOdhAJVqE\nmZ3u9bjAKVyC46W6nQfnfdyk4qIGYrLSVP11Rb/yihpJVHk3TylDpq0gMGX5HkFw\nYwZtBrJqMY+8vvqoamWfLYi8sOgKIhh3Me+26FotAn91LDAt3VeHucLQ9etVRABo\nhl99qMfnDVWW36MkzHM3l/WA0AcPm371lC6lXYr91ZBAf4BSpEtXKAywX0eNDqia\nRVcjfnepsLfUR6qiaCZEkyCj8fvQrgptXfyv5lcPf0WZ82x260KzNTeIIvfRUBjF\n92YI4ROoC6QvroxbGX+p\n-----END PRIVATE KEY-----\n",
      clientEmail:
        "firebase-adminsdk-6nqsf@chat-with-pdf-9cc9d.iam.gserviceaccount.com",
    }),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
