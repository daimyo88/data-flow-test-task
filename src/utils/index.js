import { BASE_OFFSET, COLORS } from "../meta/constants.js";

function getPosition(offset, mode, i) {
    switch (mode) {
        case 'chess':
            return {
                x: i === 0 || i % 2 === 0 ? offset[0] : offset[0] * 2,
                y: offset[1] + BASE_OFFSET.y * i
            };
        case 'horizontal':
            return {
                x: offset[0] + BASE_OFFSET.x * i,
                y: offset[1] + BASE_OFFSET.y
            };
        case 'horizontal-chess':
            return {
                x: offset[0] + BASE_OFFSET.x * i,
                y: offset[1] + BASE_OFFSET.y * i
            };
        default:
            return {
                x: offset[0],
                y: offset[1] + BASE_OFFSET.y * i
            };
    }
}

export const mapDataToNodes = (data = [], offset, color = COLORS.default, mode = 'vertical', name = '') => {
    const dataArray = Array.isArray(data) ? data : [data];
    return dataArray.map((el, i) => {
        return {
            id: '' + el.id,
            position: getPosition(offset, mode, i),
            sourcePosition: 'right',
            targetPosition: 'left',
            style: {
                background: color,
                cursor: 'pointer'
            },
            data: {
                label: el.name || name
            }
        }
    });

}

function getValueByPath(obj, fieldPath) {
    return fieldPath.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const mapDataToEdges = (source, target, sourceField, targetField) => {
    const targetFieldArray = Array.isArray(targetField) ? targetField : [targetField];
    const targetArray = Array.isArray(target) ? target : [target];
    const sourceArray = Array.isArray(source) ? source : [source];

    return sourceArray.reduce((acc, next) => {
        const value1 = getValueByPath(next, sourceField);

        const matchingItems = targetArray.filter(item2 => {
            return targetFieldArray.some(field2Path => {
                const value2 = getValueByPath(item2, field2Path);
                return Array.isArray(value2) ? value2.includes(value1) : value2 === value1;
            });
        });

        matchingItems.forEach(matchingItem => {
            acc.push({
                id: '' + next.id + matchingItem.id,
                source: '' + next.id,
                target: '' + matchingItem.id
            });
        });

        return acc;
    }, []);
}

export const mapDataToEdgesInnerRelations = (source, target) => {
    const targetArray = Array.isArray(target) ? target : [target];
    return targetArray.map(el => {
        return {
                id: '' + source.id + el.id,
                source: '' + source.id,
                target: '' + el.id
        }
    });
}

export const filterElementsByConnection = (elementId, elementsArray, connectionsArray) => {
    const relatedConnections = connectionsArray.filter(connection =>
        connection.source === elementId || connection.target === elementId
    );

    const relatedIds = relatedConnections.flatMap(connection => [connection.source, connection.target]);

    const filteredElements = elementsArray.filter(element =>
        relatedIds.includes(element.id)
    );

    return filteredElements;
}