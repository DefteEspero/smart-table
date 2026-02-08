import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями

    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map((name) => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        )
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля

        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const wrapper = action.parentElement;
            const input = wrapper?.querySelector('input');
            if (input) {
                input.value = '';
            }
            if (field in state) {
                state[field] = '';
            }
        }

        const from = state.totalFrom ? parseFloat(state.totalFrom) : '';
        const to = state.totalTo ? parseFloat(state.totalTo) : '';

        const nextState = {
            ...state,
            total: [from, to],
        };

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter((row) => compare(row, nextState));
    }
}