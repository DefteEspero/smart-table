import {getPages} from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {

    let pageCount;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action) switch (action.name) {
            case 'page': page = Number(action.value) || 1; break;
            case 'prev': page = Math.max(1, page - 1); break;
            case 'next': page = Math.min(pageCount, page + 1); break;
            case 'first': page = 1; break;
            case 'last': page = pageCount; break;
        }

        return Object.assign({}, query, {
            limit,
            page
        });

    }

    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер

    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    const updatePagination = (total, { page, limit }, query) => {
        const rowsPerPage = limit;
        pageCount = Math.ceil(total / limit);

        const visiablePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiablePages.map((pageNumber) => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        if (query === 0) {
            fromRow.textContent = 0;
            toRow.textContent = 0;
            totalRows.textContent = 0;
            pages.replaceChildren();
            return [];
        } else {
            fromRow.textContent = (page - 1) * rowsPerPage + 1;
            toRow.textContent = Math.min(page * limit, query);
            totalRows.textContent = query;
        }
    }

    return {
        applyPagination,
        updatePagination
    }
};