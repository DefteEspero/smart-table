import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    const safeColumns = (columns);
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки

            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            safeColumns.forEach((column) => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });

        // @todo: #3.2 — сбросить сортировки остальных колонок
        } else {
            safeColumns.forEach((column) => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        if (!field || !order === "none") {
            const { sort, ...rest } = query || {};
            return rest;я
        }
        // @todo: #3.3 — получить выбранный режим сортировки
        const sort = field && order !== 'none' ? `${field}:${order}` : 'null';

        return sort ? Object.assign({}, query, { sort }) : query;
    }
}