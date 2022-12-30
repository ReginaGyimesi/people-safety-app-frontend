export const filterLa = (details: any) => {
  var filtered_array = details?.address_components.filter(
    function (address_component: { types: string | string[] }) {
      return address_component.types.includes("administrative_area_level_2");
    }
  );
  var county = filtered_array?.length ? filtered_array[0].long_name : null;

  return county;
};

export const filterCountry = (details: any) => {
  var filtered_array = details?.address_components.filter(
    function (address_component: { types: string | string[] }) {
      return address_component.types.includes("administrative_area_level_1");
    }
  );
  var country = filtered_array?.length ? filtered_array[0].long_name : null;

  return country;
};

export const filterPostCode = (details: any) => {
  var filtered_array = details?.address_components.filter(
    function (address_component: { types: string | string[] }) {
      return address_component.types.includes("postal_code");
    }
  );
  return filtered_array[0];
};
