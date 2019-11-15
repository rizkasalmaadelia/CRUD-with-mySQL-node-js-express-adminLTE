var express = require('express');
var router = express.Router();

/* GET Customer page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('barang/list',{title:"barang",data:rows});
		});
     });
});
router.post('/add', function(req, res, next) {
	req.assert('kode', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_merk = req.sanitize( 'merk' ).escape().trim();
        v_satuan = req.sanitize( 'satuan' ).escape().trim();
        v_jumlah = req.sanitize( 'jumlah' ).escape().trim();
        v_harga = req.sanitize( 'harga' ).escape().trim();

		var barang = {
            kode: v_kode,
			nama: v_nama,
			merk: v_merk,
			satuan: v_satuan,
            jumlah: v_jumlah,
            harga: v_harga
		}

		var insert_sql = 'INSERT INTO barang SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/add-item', 
					{ 
                        kode: req.param('kode'),
						nama: req.param('nama'), 
						merk: req.param('merk'),
						satuan: req.param('satuan'),
                        jumlah: req.param('jumlah'),
                        harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Create Item success'); 
					res.redirect('/barang');
				}		
			});
		});
	}else{
		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-item', 
		{ 
			kode: req.param('kode'), 
			nama: req.param('nama')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'barang/add-item', 
	{ 
		title: 'Add New Barang',
		kode: '',
		nama: '',
		merk:'',
        satuan: '',
        jumlah: '',
        harga: ''
	});
});
router.get('/edit/(:kode)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang where kode='+req.params.kode,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errornya); 
				res.redirect('/barang'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Barang can't be find!"); 
					res.redirect('/Barang');
				}
				else
				{	
					console.log(rows);
					res.render('barang/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:kode)', function(req,res,next){
	req.assert('kode', 'Please fill the code').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_merk = req.sanitize( 'merk' ).escape().trim();
        v_satuan = req.sanitize( 'satuan' ).escape().trim();
        v_jumlah = req.sanitize( 'jumlah' ).escape().trim();
        v_harga = req.sanitize( 'harga' ).escape().trim();

		var barang = {
			kode: v_kode,
			nama: v_nama,
			merk: v_merk,
            satuan : v_satuan,
            jumlah: v_jumlah,
            harga: v_harga 
		}

		var update_sql = 'update barang SET ? where kode = '+req.params.kode;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/edit', 
					{ 
						kode: req.param('kode'), 
						nama: req.param('nama'),
						merk: req.param('merk'),
                        satuan: req.param('satuan'),
                        jumlah: req.param('jumlah'),
                        harga: req.param('harga'),
					});
				}else{
					req.flash('msg_info', 'Update barang success'); 
					res.redirect('/barang/edit/'+req.params.kode);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-item', 
		{ 
			kode: req.param('kode'), 
			nama: req.param('nama')
		});
	}
});
router.delete('/delete/(:kode)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var barang = {
			kode: req.params.kode,
		}
		
		var delete_sql = 'delete from barang where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/barang');
				}
				else{
					req.flash('msg_info', 'Delete Barang Success'); 
					res.redirect('/barang');
				}
			});
		});
	});
});
module.exports = router;