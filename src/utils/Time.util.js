export class TimeUtil {

    static currentUTCTimestamp = () => {
        let d1 = new Date();
        let d2 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
        return Math.floor(d2.getTime() / 1000)
    }

    static timestampToDateString = (unix_timestamp) => {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp * 1000);

        const month = date.getUTCMonth()+1
        
        // Will display time in 10:30:23 format
        var formattedTime = date.getUTCDate() + '/' + month + '/' + date.getUTCFullYear()

        return formattedTime
    }

}