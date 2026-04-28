export function initSearching(searchField) {
  return (query = {}, state = {}) => {

    const value = (state[searchField] ?? '').toString().trim();
    if (!value) {
      const { search, ...rest } = query;
      return rest;
    }

    return { ...query, search: value };
  };
}