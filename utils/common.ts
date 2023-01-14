// Extract local authority from Google location search response.
export const filterLa = (details: any) => {
  var filtered_array = details?.address_components.filter(
    function (address_component: { types: string | string[] }) {
      return address_component.types.includes("administrative_area_level_2");
    }
  );
  var county = filtered_array?.length ? filtered_array[0].long_name : null;

  return county;
};

// Extract country from Google location search response.
export const filterCountry = (details: any) => {
  var filtered_array = details?.address_components.filter(
    function (address_component: { types: string | string[] }) {
      return address_component.types.includes("administrative_area_level_1");
    }
  );
  var country = filtered_array?.length ? filtered_array[0].long_name : null;

  return country;
};

// Extract post code from Google location search response.
export const filterPostCode = (details: any) => {
  var filtered_array = details?.address_components.filter(
    function (address_component: { types: string | string[] }) {
      return address_component.types.includes("postal_code");
    }
  );
  return filtered_array[0];
};
