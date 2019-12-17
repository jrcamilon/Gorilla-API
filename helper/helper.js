/**
 * Helper Functions
 */
module.exports = {

    /** Converts a list into 'item1', 'item2' to use - const id_list = helper.convertFilterList(req.body.site_id_list); */
    convertFilterList: (arrayList) => {
        return "'" + arrayList.join("\', \'") + "' ";
    }

};