import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
// @todo: подключение

import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = Number(state.rowsPerPage) || 10;

    const pageRaw = Number(state.page);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    return {
        ...state, rowsPerPage, page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();
    let query  = {}; 
    query  = applySearching(query, state, action);
    query  = applyFiltering(query, state, action);
    query  = applySorting(query, state, action);
    query  = applyPagination(query, state, action);

    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// @todo: инициализация

const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

let applyFiltering = (query) => query;

const applySearching = initSearching('query');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const api = initData();
    const indexes = await api.getIndexes();
    applyFiltering = initFiltering(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

init().then(render);