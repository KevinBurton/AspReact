export default function toLocalDateString(date: Date): string {
    'use strict';
    var d = new Date(date + " UTC");
    var dateString = ("0" + d.getDate()).slice(-2) + " " + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()] + " " + d.getFullYear() + ", " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return dateString;
}
