const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let orders = [];

app.get('/admin', (req, res) => {
    let total = orders.reduce((sum, o) => sum + o.price, 0);
    let rows = '';
    
    if (orders.length === 0) {
        rows = '<tr><td colspan="6" style="padding:30px;color:#666">لا توجد طلبات - جرب الشراء!</td></tr>';
    } else {
        for (let order of orders.reverse()) {
            let button = order.status != 'delivered' ? 
                '<button onclick="deliver(\'' + order.id + '\')">تسليم</button>' : 
                '✅';
            rows += '<tr class="' + order.status + '">';
            rows += '<td style="max-width:200px;word-break:break-all">' + order.videoUrl + '</td>';
            rows += '<td>' + order.views.toLocaleString() + '</td>';
            rows += '<td style="color:#ff1493;font-weight:bold">$' + order.price + '</td>';
            rows += '<td>' + new Date(order.timestamp).toLocaleString('ar-SA') + '</td>';
            rows += '<td>' + (order.status == 'delivered' ? '✅ تم' : '⏳ قيد الانتظار') + '</td>';
            rows += '<td>' + button + '</td>';
            rows += '</tr>';
        }
    }
    
    res.send(`
<!DOCTYPE html>
<html dir="rtl">
<head><title>لوحة التحكم</title>
<style>
body{font-family:Tahoma;background:#f0f8ff;padding:20px}
h1{color:#ff1493;text-align:center;font-size:2.5em}
h2{text-align:center;color:#333;margin:20px 0}
.total{background:#90ee90;padding:15px 30px;border-radius:25px;display:inline-block;font-size:1.5em}
.table{width:100%;border-collapse:collapse;border:2px solid #ddd;margin:20px 0}
th{background:#ff69b4;color:white;padding:15px;font-weight:bold}
td{padding:12px;border:1px solid #ddd;text-align:center}
.pending{background:#fff3cd}
.delivered{background:#d4edda}
button{background:#32cd32;color:white;border:none;padding:10px 20px;border-radius:10px;cursor:pointer;font-weight:bold}
button:hover{background:#228b22}
</style>
</head>
<body>
<h1>🚀 لوحة تحكم TikTok Views</h1>
<h2>💰 إجمالي الدخل: <span class="total">$${total.toFixed(2)}</span></h2>
<table class="table">
<tr><th>رابط الفيديو</th><th>المشاهدات</th><th>السعر</th><th>التاريخ</th><th>الحالة</th><th>الإجراء</th></tr>
${rows}
</table>
<script>
function deliver(id){
    fetch('/api/deliver/' + id, {method:'POST'}).then(()=>location.reload());
}
</script>
</body></html>`);
});

app.post('/api/order', (req, res) => {
    const order = {
        id: Date.now().toString(),
        videoUrl: req.body.videoUrl,
        views: req.body.views,
        price: req.body.price,
        timestamp: new Date(),
        status: 'pending'
    };
    orders.push(order);
    console.log('🆕 طلب جديد $' + order.price);
    res.json({ success: true });
});

app.post('/api/deliver/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
        order.status = 'delivered';
        console.log('✅ تم التسليم');
    }
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('\\n🌟🌟🌟 الموقع جاهز! 🌟🌟🌟');
    console.log('👉 الموقع:     http://localhost:3000');
    console.log('👉 اللوحة:     http://localhost:3000/admin');
    console.log('Ctrl+C للإيقاف\\n');
});
