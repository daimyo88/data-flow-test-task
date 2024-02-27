import { BASE_OFFSET } from "../meta/constants.js";

function getXOffset(offset, chessMode, i) {
    if (chessMode) {
        return i === 0 || i % 2 === 0 ? offset[0] : offset[0] * 2;
    } else {
        return offset[0];
    }
}

export const mapDataToNodes = (data = [], offset, color = '#ddd', chessMode) => {

    if (Array.isArray(data)) {
        return data.map((el, i) => {
            return {
                id: '' + el.id,
                position: {
                    x: getXOffset(offset, chessMode, i),
                    y: offset[1] + BASE_OFFSET.y * i
                },
                sourcePosition: 'right',
                targetPosition: 'left',
                draggable: false,
                style: {
                    background: color,
                    cursor: 'pointer'
                },
                data: {
                    label: el.name
                }
            }
        });
    } else {
        return {
            id: '' + data.id,
            position: {
                x: offset[0],
                y: offset[1]
            },
            sourcePosition: 'right',
            targetPosition: 'left',
            draggable: false,
            style: {
                background: color,
                cursor: 'pointer'
            },
            data: {
                label: data.name
            },
        }
    }
}

function getValueByPath(obj, fieldPath) {
    return fieldPath.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const mapDataToEdges = (array1, array2, field1, field2Paths) => {
    const field2Array = Array.isArray(field2Paths) ? field2Paths : [field2Paths];

    return array1.reduce((acc, item1) => {
        const value1 = getValueByPath(item1, field1);

        const matchingItems = array2.filter(item2 => {
            return field2Array.some(field2Path => {
                const value2 = getValueByPath(item2, field2Path);
                return Array.isArray(value2) ? value2.includes(value1) : value2 === value1;
            });
        });

        matchingItems.forEach(matchingItem => {
            acc.push({
                id: '' + item1.id + matchingItem.id,
                source: '' + item1.id,
                target: '' + matchingItem.id
            });
        });

        return acc;
    }, []);
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