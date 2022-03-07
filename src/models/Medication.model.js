import { TimeUtil } from '../utils/Time.util'

export default class Medication {

    ID = null;
    class = null;
    name = null;
    schedule = null;
    route = null

    constructor() {
        this.ID = TimeUtil.currentUTCTimestamp()
    }

    get toJson() {
        return {
            ID: this.ID,
            class: this.class,
            name: this.name,
            schedule: this.schedule,
            route: this.route
        }
    }

    static initFromJson = (json) => {
        let medication = new Medication()
        if (json == null) return medication
        
        medication.ID = json.ID
        medication.class = json.class
        medication.name = json.name
        medication.schedule = json.schedule
        medication.route = json.route
        return medication
    }

}