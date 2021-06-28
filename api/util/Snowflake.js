export default function read() {
        let count = 0;
        let list = [];
        let str = '';
        for (let i = 0; i < 1; i++) {
            let s = '';
            for (let j = 0; j < 3; j++) {
                s += "0123456789".charAt(Math.floor(Math.random() * "0123456789".length));
            }
            let bo = false;
            for (let ii = 0; ii < list.length; ii++) {
                if (list[ii] == s) {
                    bo = true;
                    alert(s);
                    break;
                }
            }
            if (bo) continue;
            var time = new Date().getTime().toString();
            str += new Date().getFullYear().toString().substring(2, 4) + s + time.substring(time.length-1,time.length);
            list.push(s);
            count++;
        }
        return str;
    }