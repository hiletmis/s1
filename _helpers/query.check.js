module.exports = {
    queryBuilder
}


function queryBuilder(body, query) {

    //check if user is provided
    if (body.user != null) {
        query.user = body.user
    }

    //check if location is provided
    if (body.location != null) {
        query.location = body.location
    }

    //check if start and end date are provided
    if (body.startDate != null && body.endDate != null) {
        query.intime = { $gte: body.startDate, $lte: body.endDate }
    }

    //check if only start date is provided
    if (body.startDate != null && body.endDate == null) {
        query.intime = { $gte: body.startDate }
    }

    //check if today is provided
    if (body.predefined == "today") {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        query.intime = { $gte: date }
    }

    //check if last 7 days is provided
    if (body.predefined == "last7Days") {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        query.intime = { $gte: date }
    }

    //check if last 30 days is provided
    if (body.predefined == "last30Days") {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        query.intime = { $gte: date }
    }

    //check if last month is provided
    if (body.predefined == "lastMonth") {
        const date = new Date();

        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth(), 1);
        query.intime = { $gte: firstDay, $lte: lastDay }
    }

    return query;
}