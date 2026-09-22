const eventInventoryReservationService = require("../Services/eventInventoryReservationService");

const startReservationExpirationWorker = () => {
    const interval = setInterval(async () => {
        try {
            const expiredCount =
                await eventInventoryReservationService.expireReservations({
                    limit: 100
                });

            if (expiredCount > 0) {
                console.log(
                    `Expired ${expiredCount} reservation(s)`
                );
            }
        } catch (error) {
            console.error(
                "Reservation expiration worker failed:",
                error
            );
        }
    }, 5000);

    return interval;
};

module.exports = {
    startReservationExpirationWorker
};