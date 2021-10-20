module.exports = {
  moduleFileExtensions: [
      "js",
      "json",
      "vue"
  ],
  transform: {
      ".*\\.(vue)$": "vue-jest",
      "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
      ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/node_modules/jest-css-modules-transform",
      "\\.(gql|graphql)$": "jest-transform-graphql"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
}
