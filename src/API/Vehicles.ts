import { gql } from "@apollo/client";

const GET_VEHICLES = gql`
  query Vehicles($languageCode: String = "ru") {
    vehicles(lang: $languageCode) {
      title
      description
      icons {
        large
      }
      level
      type {
        name
        title
      }
      nation {
        name
        title
      }
    }
  }
`;

export { GET_VEHICLES }