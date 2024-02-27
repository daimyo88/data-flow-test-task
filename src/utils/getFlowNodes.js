import { mapDataToNodes } from "./index.js";
import { CAMPAIGN_FIELDS_TO_ITERATE, BASE_OFFSET, COLORS } from "../meta/constants.js";

const getFlowNodes = (data = []) => {

   let campaignSettingsNodes = [];

    const additionalSourcesNodes = mapDataToNodes(data?.additionalSources?.additionalSources, [0, 0], COLORS.additionalSourcesNodes);
    const variableNodes = mapDataToNodes(data?.variables?.variables, [BASE_OFFSET.x, 0], COLORS.variables, true);
    const feedExportsNodes = mapDataToNodes(data?.feedExports?.feedExports, [BASE_OFFSET.x * 3, variableNodes.length * BASE_OFFSET.y], COLORS.feedExports);

    let campaignYOffset = 0;
    data?.campaignSettings?.campaignSettings.forEach(setting => {
        let xOffset = 0;
        let yOffset = BASE_OFFSET.y;
        const campaignNode = mapDataToNodes(setting, [BASE_OFFSET.x * 4, campaignYOffset], COLORS.campaign);
        campaignSettingsNodes.push(campaignNode);
        for (const [key, value] of Object.entries(setting)) {
            if (CAMPAIGN_FIELDS_TO_ITERATE.includes(key)) {
                const nodes = mapDataToNodes(value, [BASE_OFFSET.x * 5 + xOffset, campaignYOffset + yOffset], COLORS[key]);
                campaignSettingsNodes = [...campaignSettingsNodes, ...nodes];
                xOffset += BASE_OFFSET.x;
                yOffset = campaignSettingsNodes.length * BASE_OFFSET.y;
            }
        }
        campaignYOffset = campaignYOffset + campaignSettingsNodes.length * BASE_OFFSET.y;
    });

    return [
            ...additionalSourcesNodes,
            ...variableNodes,
            ...feedExportsNodes,
            ...campaignSettingsNodes,
        ]

}

export default getFlowNodes;