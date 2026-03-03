// @todo: #4.3 — настроить компаратор

// файл удалён т.к его функционал вфполняет сервер 
// const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями

    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
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

        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}