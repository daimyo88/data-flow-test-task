import {mapDataToEdges, mapDataToEdgesInnerRelations} from "./index.js";
import { CAMPAIGN_FIELDS_TO_EDGES_VARIABLES, CAMPAIGN_FIELDS_TO_EDGES_INNER_RELATIONS } from "../meta/constants.js";
const getFlowEdges = (data) => {
    if (!data) {
        return [];
    }
    const additionalSourcesEdges = mapDataToEdges(
        data?.additionalSources?.additionalSources,
        data?.variables?.variables,
        "id",
        "additionalSource.id"
    );

    const feedExportEdges =  mapDataToEdges(
        data?.variables?.variables,
        data?.feedExports?.feedExports,
        "placeholderName",
        ["getPlaceholdersWithoutConditions", "getConditionsPlaceholders"]
    );

    const variablesEdges = mapDataToEdges(
        data?.variables?.variables,
        data?.variables?.variables,
        "placeholderName",
        ["getPlaceholdersWithoutConditions", "getConditionsPlaceholders"]
    );

    let campaignSettingsEdges = [];

    const campaignEdges = mapDataToEdges(
        data?.variables?.variables,
        data?.campaignSettings?.campaignSettings,
        "placeholderName",
        ["getPlaceholdersWithoutConditions", "getConditionsPlaceholders"]
    );

    campaignSettingsEdges.push(...campaignEdges);

    data?.campaignSettings?.campaignSettings.forEach(setting => {

        for (const [key, value] of Object.entries(setting)) {

            if (CAMPAIGN_FIELDS_TO_EDGES_VARIABLES.includes(key)) {

                const campaignInnerEdges = mapDataToEdgesInnerRelations(setting, value);
                const variablesEdges = mapDataToEdges(
                    data?.variables?.variables,
                    value,
                    "placeholderName",
                    ["getPlaceholdersWithoutConditions", "getConditionsPlaceholders"]
                );
                campaignSettingsEdges = [...campaignSettingsEdges, ...campaignInnerEdges, ...variablesEdges];
            }

            if (CAMPAIGN_FIELDS_TO_EDGES_INNER_RELATIONS.includes(key)) {
                const innerRelationsEdges = mapDataToEdges(
                    setting[key],
                    value,
                    "id",
                    ["parentId"]
                );
                campaignSettingsEdges = [...campaignSettingsEdges, ...innerRelationsEdges];
            }

        }

    });

    return [
        ...campaignSettingsEdges,
        ...additionalSourcesEdges,
        ...feedExportEdges,
        ...variablesEdges
    ];

}

export default getFlowEdges;