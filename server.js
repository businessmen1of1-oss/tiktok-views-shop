const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51TNyYDDqqoPEh5xy0sQnU9ucd6PZC6L1lX0mzVgGzKScg7ft2SrCdTjBYnKh1igSSOCUQILruJbmDOzwsmJbre7w00gdpUbzK9');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let orders = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    let total = orders.reduce((sum, o) => sum + o.price, 0);
    let rows = '';
    
    if (orders.length === 0) {
        rows = '<tr><td colspan="6" style="padding:30px;color:#666">لا توجد طلبات</td></tr>';
    } else {
        for (let order of orders.reverse()) {
            let button = order.status != 'delivered' ? 
                '<button onclick="deliver(\'' + order.id + '\')">تسليم</button>' : 
                '✅';
            rows += '<tr><td>' + order.videoUrl + '</td><td>' + order.views.toLocaleString() + '</td><td>$' + order.price + '</td><td>' + new Date(order.timestamp).toLocaleString('ar-SA') + '</td><td>' + order.status + '</td><td>' + button + '</td></tr>';
        }
    }
    
    res.send(`
<!DOCTYPE html>
<html dir="rtl"><head><title>لوحة التحكم</title><style>body{font-family:Tahoma;background:#f0f8ff;padding:20px}h1{color:#ff1493;text-align:center;font-size:2.5em}h2{text-align
