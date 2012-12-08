
var idListaSel = 0;
var mayorSel = 0;
var menorSel = 0;

var idCompetenciaSel = 0;
var idProductoSel = 0;
var idProductoCargaSel = 0;

var nombreListaSel = "";
var nombreCompetenciaSel = "";
var nombreUsuario = "";

var listaProductosSel;
var rowIdSel;
var largoAux = 0;

var hostParam = "";
var portParam = "";

var precioSodimacSel = "";
var tipoSave = "";

function deleteDataDB(tx) {
    tx.executeSql("DELETE FROM LISTAS");        
    tx.executeSql("DELETE FROM COMPETENCIAS");   
    tx.executeSql("DELETE FROM PRODUCTOS"); 
} 

function populateDB(tx) { 
    
    var scriptUsuario = 'CREATE TABLE IF NOT EXISTS SESION_USUARIO (ID_USUARIO INTEGER,NOMBRE_USUARIO TEXT,FECHA DATE)'
    var scriptLista = 'CREATE TABLE IF NOT EXISTS LISTAS (ID_LISTA INTEGER primary key NOT NULL,NOMBRE_LISTA TEXT NULL,MAYOR INTEGER NULL,MENOR INTEGER NULL)';
    var scripCompetencia = 'CREATE TABLE IF NOT EXISTS COMPETENCIAS(ID_COMPETENCIA INTEGER not null,ID_LISTA INTEGER not null,NOMBRE_COMPETENCIA TEXT not null,primary key (ID_COMPETENCIA, ID_LISTA));';
    
    var scriptProductos = 'CREATE TABLE IF NOT EXISTS PRODUCTOS (ID_PRODUCTO INTEGER NOT NULL,ID_COMPETENCIA INTEGER NOT NULL,ID_LISTA INTEGER NOT NULL,CODIGO_PRODUCTO TEXT NULL,NOMBRE_PRODUCTO TEXT NULL,DESCRIPCION_PRODUCTO TEXT NULL,PRECIO_VIGENTE INTEGER NULL,PRECIO_SODIMAC INTEGER NULL,PRECIO_ACTUAL INTEGER NULL,MISMO_PRECIO INTEGER NULL,OBSERVACION TEXT NULL,ENCONTRADO INTEGER NULL,PRIMARY KEY (ID_PRODUCTO, ID_COMPETENCIA,ID_LISTA));';    
    
    //var scriptParam = 'CREATE TABLE IF NOT EXISTS PARAMETROS (COD_PARAM TEXT,VALUE_PARAM TEXT)'

    
        tx.executeSql(scriptUsuario);   
        tx.executeSql(scriptLista);        
        tx.executeSql(scripCompetencia);   
        tx.executeSql(scriptProductos); 
        //tx.executeSql(scriptParam);
    }

    function queryGetParametros(){   
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        db.transaction(queryParam, errorCB);
    }

    function queryGetTolerancia(){   
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        db.transaction(queryTolerancia, errorCB);
    }

    function queryGetListaPrecios(){   
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        db.transaction(queryDB, errorCB);
    }

    function queryGetCompetenciasByLista(idLista,nombreLista){
        //alert("idLista:" + idLista);
        idListaSel = idLista;
        queryGetTolerancia();
        nombreListaSel = nombreLista; 
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        db.transaction(queryComp, errorCB);
    }

    function queryGetProductos(idCompetencia,nombreCompetencia){
        //alert("idLista:" + idLista);
        idCompetenciaSel = idCompetencia;
        nombreCompetenciaSel = nombreCompetencia;
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        db.transaction(queryProd, errorCB); 
    }

    function queryGetDetalleProductos(idProducto){
        //alert("idLista:" + idLista);
        idProductoSel = idProducto;
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        db.transaction(queryDetProd, errorCB); 
    }
    
    function queryGetShoppingProductos(){
        //alert("idLista:" + idLista);
        //idProductoSel = idProducto;
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        db.transaction(queryShoppingProd, errorCB); 
    }

    function queryUpdateShoppingProductos(tipo){
        if (!validarFormulario()) return;
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        tipoSave = tipo;
        
        console.log("PASO 1.1");
        db.transaction(queryUpdateProd, errorCB,successUpdate);
        
    }

    function queryUpdateShoppingProductosNav(){       
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        try{
            console.log("PASO 2.1");
            db.transaction(queryUpdateProd, errorCB,successUpdateNav); 
            console.log("PASO 2.2");
        }catch(err){
            console.log("Error Paso 2.1:" + err.message);
        }
          
    }    
    
    function queryInsertUsuario(idUsuario,nombreUsuario){       
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
                
        db.transaction(function(tx) {                      
                       var strSql = "SELECT * FROM SESION_USUARIO WHERE ID_USUARIO =" + idUsuario;                                            
                       tx.executeSql(strSql, [],function(tx, results)
                                     {
                                     console.log("*-results:" + results.rows.length)
                                     //largoAux = results.rows.length;
                                     if (results.rows.length > 0)eliminarDatos();
                                     
                                     }                                                   
                        ); 
                       
                       tx.executeSql("DELETE FROM SESION_USUARIO");                       
                       tx.executeSql("INSERT INTO SESION_USUARIO (ID_USUARIO, NOMBRE_USUARIO,FECHA) VALUES (?,?,?)", [idUsuario,nombreUsuario,new Date()]);                           
                       },errorCB,successInsertLista);
        
    }

/*
function queryInsertListas(objListaB){      
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);        
    db.transaction(function(tx) {
                   var strSql = "INSERT INTO LISTAS (ID_LISTA, NOMBRE_LISTA) VALUES (?, ?)"
                   var idLista = objListaB.getElementsByTagName("idLista")[0].childNodes[0].nodeValue;
                   var nombreLista = objListaB.getElementsByTagName("nombreLista")[0].childNodes[0].nodeValue;
                   tx.executeSql(strSql, [idLista,nombreLista]);                           
                   });
    
}
*/
function queryInsertParametros(host,port){      
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);        
    db.transaction(function(tx) {
                   var scriptParam = 'CREATE TABLE IF NOT EXISTS PARAMETROS (COD_PARAM TEXT,VALUE_PARAM TEXT)'
                   tx.executeSql(scriptParam);
                   
                   tx.executeSql("DELETE FROM PARAMETROS");
                   var strSql = "INSERT INTO PARAMETROS (COD_PARAM, VALUE_PARAM) VALUES (?, ?)"                   
                   tx.executeSql(strSql, ["HOST",host]);    
                   tx.executeSql(strSql, ["PORT",port]);    
                },errorCB,cargarParametros);
    
}



    function queryInsertListas(objLista){  
        
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);        
        var largo = -1;
        
        db.transaction(function(tx) {
                       var idLista = objLista.getElementsByTagName("idLista")[0].childNodes[0].nodeValue;
                       var strSql = "SELECT * FROM LISTAS WHERE ID_LISTA =" + idLista;
                       //console.log("strSql:" + strSql);                       
                       tx.executeSql(strSql, [],function(tx, results)
                                               {
                                                    console.log("-results:" + results.rows.length)
                                                    largoAux = results.rows.length;
                                                }                                                   
                                            );
                       
                       console.log("arrData.length :" + largoAux );
                       if (largoAux == 0){                           
                           try{
                               strSql = "INSERT INTO LISTAS (ID_LISTA, NOMBRE_LISTA,MAYOR,MENOR) VALUES (?,?,?,?)"
                               var idLista = objLista.getElementsByTagName("idLista")[0].childNodes[0].nodeValue;
                               var nombreLista = objLista.getElementsByTagName("nombreLista")[0].childNodes[0].nodeValue; 
                               var mayor = objLista.getElementsByTagName("toleranciaMayorQue")[0].childNodes[0].nodeValue; 
                               var menor = objLista.getElementsByTagName("toleranciaMenorQue")[0].childNodes[0].nodeValue; 
                           
                               console.log("strSql:" + strSql); 
                               tx.executeSql(strSql, [idLista,nombreLista,mayor,menor]); 
                           }catch(err){
                                console.log("Error al insertar Listas:" +  err.message); 
                           }
                       }
                       
                       });
        
        
        if (largoAux == 0)return true;
        return false;
    }
 
/*
    function queryVerifyLista(tx){   
        var idLista = objLista.getElementsByTagName("idLista")[0].childNodes[0].nodeValue;
        var strSql = 'SELECT * FROM LISTAS WHERE ID_LISTA = ' + idLista;
        tx.executeSql(strSql, [], queryInsertListas, errorCB);
    }
*/
    function queryVerifyLista(tx){ 
       // console.log("-PASO 2");
        var idLista = objLista.getElementsByTagName("idLista")[0].childNodes[0].nodeValue;
        var strSql = 'SELECT * FROM LISTAS WHERE ID_LISTA = ' + idLista;
        var result = new Array();
        //console.log("-PASO 2.1");
        tx.executeSql(strSql, result);
        //console.log("-PASO 2.2");
       // console.log("-PASO 2.9:" + result.length);
        
        if (result.length == 0){        
            var strSql = "INSERT INTO LISTAS (ID_LISTA, NOMBRE_LISTA) VALUES (?, ?)"
            var idLista = objLista.getElementsByTagName("idLista")[0].childNodes[0].nodeValue;
            var nombreLista = objLista.getElementsByTagName("nombreLista")[0].childNodes[0].nodeValue;
           // console.log("PASO 6:idLista" + idLista);
           // console.log("PASO 6:nombreLista" + nombreLista);
            tx.executeSql(strSql, [idLista,nombreLista]);   
        }            
        return result;
    }

    function verifyLista(objListaA){        
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000); 
        //console.log("-PASO 1");
        var result = new Array();        
        db.transaction(function(tx) {
                       var idLista = objListaA.getElementsByTagName("idLista")[0].childNodes[0].nodeValue;
                       var strSql = 'SELECT * FROM LISTAS WHERE ID_LISTA = ' + idLista;                      
                       tx.executeSql(strSql, result);                           
                       });
        
        if (result.length > 0) return false;
        
        db.transaction(function(tx) {
                       var strSql = "INSERT INTO LISTAS (ID_LISTA, NOMBRE_LISTA) VALUES (?, ?)"
                       var idLista = objListaA.getElementsByTagName("idLista")[0].childNodes[0].nodeValue;
                       var nombreLista = objListaA.getElementsByTagName("nombreLista")[0].childNodes[0].nodeValue;
                       
                       tx.executeSql(strSql, [idLista,nombreLista]);                           
                       });
        
        return true;
    
    }

    function queryInsertCompetencias(objComp,idLista){       
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        var strSql = "INSERT INTO COMPETENCIAS (ID_COMPETENCIA,ID_LISTA, NOMBRE_COMPETENCIA) VALUES (?,?, ?)"
               
        db.transaction(function(tx) {  
                       
                       var idCompetencia = objComp.getElementsByTagName("idCompetencia")[0].childNodes[0].nodeValue;                    
                       var nombreCompetencia = objComp.getElementsByTagName("nombreCompetencia")[0].childNodes[0].nodeValue;
                       
                       tx.executeSql(strSql, [idCompetencia,idLista,nombreCompetencia]);                           
                       });
        
    }

    function queryInsertProductos(objComp,idCompetencia,idLista){       
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        var strSql = "INSERT INTO PRODUCTOS (ID_PRODUCTO,ID_COMPETENCIA,ID_LISTA,CODIGO_PRODUCTO, NOMBRE_PRODUCTO,PRECIO_VIGENTE,PRECIO_SODIMAC,ENCONTRADO) VALUES (?,?,?,?,?,?,?,?)";
        
        db.transaction(function(tx) {  
                       try{
                           console.log("PASO 1"); 
                           var idProducto = objComp.getElementsByTagName("idProducto")[0].childNodes[0].nodeValue;   
                           console.log("PASO 2");    
                           var codigoProducto = objComp.getElementsByTagName("codigoProducto")[0].childNodes[0].nodeValue;  
                           console.log("PASO 3");
                           var nombreProducto = objComp.getElementsByTagName("nombreProducto")[0].childNodes[0].nodeValue;
                           console.log("PASO 4");
                           var precioVigente = objComp.getElementsByTagName("precioVigente")[0].childNodes[0].nodeValue;
                           console.log("PASO 5");
                           var precioSodimac = "0";
                           //console.log("2-Agregando Producto[" + objComp.getElementsByTagName("precioSocimac") + "]");
                           //if (objComp.getElementsByTagName("precioSocimac").length > 0){
                           precioSodimac = objComp.getElementsByTagName("precioSocimac")[0].childNodes[0].nodeValue;
                           //}
                           console.log("2-Agregando Producto[" + nombreProducto + "]");
                           console.log("2-Agregando Producto[" + nombreProducto + "]");    
                       
                           tx.executeSql(strSql, [idProducto,idCompetencia,idLista,codigoProducto,nombreProducto,precioVigente,precioSodimac,-1]);
                       }catch(err){
                            console.log("3-Error Agregando Producto[" + err.message + "]");
                       }
                       });       
    }

    function queryInsListas(tx){       
        var strSql = 'INSERT INTO LISTAS (ID_LISTA, NOMBRE_LISTA) VALUES (1, "Animales")';
        tx.executeSql(strSql);
    }

    function queryComp(tx){       
        var strSql = 'SELECT COUNT(*) CANTIDAD,COMP.ID_COMPETENCIA,COMP.NOMBRE_COMPETENCIA FROM COMPETENCIAS COMP,PRODUCTOS PROD WHERE PROD.ID_COMPETENCIA = COMP.ID_COMPETENCIA AND PROD.ID_LISTA = COMP.ID_LISTA AND COMP.ID_LISTA ="' + idListaSel + '" GROUP BY PROD.ID_COMPETENCIA';
        
        console.log("strSql:" + strSql);
        tx.executeSql(strSql, [], querySuccessCompetencia, errorCB);
    }

    function queryProd(tx){
        var strSql = 'SELECT PROD.ID_PRODUCTO,PROD.CODIGO_PRODUCTO,PROD.DESCRIPCION_PRODUCTO,PROD.NOMBRE_PRODUCTO,PROD.PRECIO_VIGENTE,PROD.PRECIO_SODIMAC,PROD.PRECIO_ACTUAL,PROD.ENCONTRADO,PROD.MISMO_PRECIO,COMP.NOMBRE_COMPETENCIA NOMBRE_COMPETENCIA,LST.NOMBRE_LISTA NOMBRE_LISTA FROM PRODUCTOS PROD,COMPETENCIAS COMP,LISTAS LST';
        strSql = strSql + ' WHERE COMP.ID_COMPETENCIA = PROD.ID_COMPETENCIA AND COMP.ID_LISTA = PROD.ID_LISTA AND LST.ID_LISTA = PROD.ID_LISTA';
        strSql = strSql + ' AND COMP.ID_COMPETENCIA =' + idCompetenciaSel + ' AND PROD.ID_LISTA  =' + idListaSel;
        
        console.log("strSql:" + strSql);
        
        tx.executeSql(strSql, [], querySuccessProductos, errorCB);
    }

    function queryDetProd(tx){        
        //var strSql = 'SELECT * FROM PRODUCTOS WHERE ID_COMPETENCIA ="' + idCompetenciaSel + '" AND ID_LISTA  ="' + idListaSel + '" AND ID_PRODUCTO ="' + idProductoSel + '"';
        
        var strSql = 'SELECT PROD.DESCRIPCION_PRODUCTO DESCRIPCION_PRODUCTO,PROD.NOMBRE_PRODUCTO NOMBRE_PRODUCTO,PROD.PRECIO_VIGENTE PRECIO_VIGENTE,PROD.PRECIO_ACTUAL PRECIO_ACTUAL,COMP.NOMBRE_COMPETENCIA NOMBRE_COMPETENCIA,LST.NOMBRE_LISTA NOMBRE_LISTA FROM PRODUCTOS PROD,COMPETENCIAS COMP,LISTAS LST';
        strSql = strSql + ' WHERE COMP.ID_COMPETENCIA = PROD.ID_COMPETENCIA AND COMP.ID_LISTA = PROD.ID_LISTA AND LST.ID_LISTA = PROD.ID_LISTA';
        strSql = strSql + ' AND COMP.ID_COMPETENCIA =' + idCompetenciaSel + ' AND PROD.ID_LISTA  =' + idListaSel + ' AND PROD.ID_PRODUCTO =' + idProductoSel;
               
        //console.log("strSql: " + strSql);
        
        tx.executeSql(strSql, [], querySuccessDetalleProducto, errorCB);
    }

    function queryShoppingProd(tx){
        var strSql = 'SELECT PROD.PRECIO_VIGENTE PRECIO_VIGENTE,PROD.PRECIO_ACTUAL PRECIO_ACTUAL,COMP.NOMBRE_COMPETENCIA NOMBRE_COMPETENCIA FROM PRODUCTOS PROD,COMPETENCIAS COMP';
        strSql = strSql + ' WHERE COMP.ID_COMPETENCIA = PROD.ID_COMPETENCIA AND COMP.ID_LISTA = PROD.ID_LISTA AND PROD.ID_LISTA  =' + idListaSel + ' AND PROD.ID_PRODUCTO =' + idProductoSel;
        
        //console.log("strSql: " + strSql);
        
        tx.executeSql(strSql, [], querySuccessShoppingProducto, errorCB);
    }

    function validarFormulario(){
        var strMensaje = "";
        var enc = $('#toggleEncontrado').val();
        
        if (enc == "1"){   
            if ($('#txtPrecio').val().trim() == ""){
                strMensaje = "-Precio\n" + strMensaje;
                $('#txtPrecio').focus();
            }
            if (strMensaje != ""){
                strMensaje = "Debe ingresar los siguientes Campos :\n" + strMensaje;                
                alert(strMensaje);
                return false;
            }
            var topeMayor = precioSodimacSel * (1 + (mayorSel/100));
            var topeMenor = precioSodimacSel * (1 - (menorSel/100));
            var valorIngresado = parseInt($('#txtPrecio').val());  
            var r = false;
            if (valorIngresado > topeMayor){
                r = confirm("El valor supera la tolerancia mayor [" + mayorSel + "%]\n desea continuar ?")
            }
            if (valorIngresado < topeMenor){
                r = confirm("El valor supera la tolerancia menor [" + menorSel + "%]\n desea continuar ?")
            }
            if (!r){
                $('#txtPrecio').val("0");
                return false;
            }
            
            
        }    
        return true;
    }

    function queryUpdateProd(tx){        
        var txtPrecio = $('#txtPrecio').val().trim();
        var txtObs = $('#txtObservaciones').val().trim(); 
        var enc = $('#toggleEncontrado').val();
        var misPrecio = "0";
        
        if (txtPrecio.trim() == ""){
            txtPrecio = "0";
        }
        
        if ($("#chkMismoPrecio").is(":checked")){            
            misPrecio = "1";
        }
        
        var strSql = "UPDATE PRODUCTOS SET PRECIO_ACTUAL =" + txtPrecio + ",OBSERVACION='" + txtObs + "',ENCONTRADO =" + enc + ",MISMO_PRECIO =" + misPrecio;
        strSql = strSql + " WHERE ID_COMPETENCIA =" + idCompetenciaSel + " AND ID_LISTA  =" + idListaSel + " AND ID_PRODUCTO =" + idProductoSel;
        
        console.log("strSql:" + strSql);
        tx.executeSql(strSql);
    }

    // Query the database
    //
    function queryDB(tx) {
        var strSql = "SELECT LST.ID_LISTA ID_LISTA,LST.NOMBRE_LISTA,count(LST.ID_LISTA) CANTIDAD FROM LISTAS LST,COMPETENCIAS COMP WHERE COMP.ID_LISTA = LST.ID_LISTA GROUP BY LST.ID_LISTA";
        
        console.log("strSql:"+ strSql);        
        tx.executeSql(strSql, [], querySuccess, errorCB);
    }

    function queryParam(tx) {
        var strSql = "SELECT * FROM PARAMETROS";
        
        console.log("strSql:"+ strSql);        
        tx.executeSql(strSql, [], querySuccessParam, errorCB);
    }

    function querySuccessParam(tx, results) {
        console.log("*-results:" + results.rows.length);       
        for (i=0;i<results.rows.length;i++){
            if (results.rows.item(i).COD_PARAM == "HOST"){
                console.log("encontro HOST:" + results.rows.item(i).VALUE_PARAM);
                hostParam = results.rows.item(i).VALUE_PARAM;
            }
            if (results.rows.item(i).COD_PARAM == "PORT"){
                console.log("encontro PORT:" + results.rows.item(i).VALUE_PARAM);
                portParam = results.rows.item(i).VALUE_PARAM;
            }
        }
        $('#txtHost').val(hostParam);
        $('#txtPort').val(portParam);
        $.mobile.changePage("#login",{ transition: "slidedown"});
    }     

    function queryTolerancia(tx) {
        var strSql = "SELECT * FROM LISTAS WHERE ID_LISTA=" + idListaSel;
    
        console.log("strSql:"+ strSql);        
        tx.executeSql(strSql, [], querySuccessTol, errorCB);
    }

    function querySuccessTol(tx, results) {
        console.log("*-results:" + results.rows.length);       
        for (i=0;i<results.rows.length;i++){
           mayorSel = results.rows.item(i).MAYOR;  
           menorSel = results.rows.item(i).MENOR; 
        }
    }  

    // Query the success callback
    //
    function querySuccess(tx, results) {        
        
        
        $('#lst_prod').children().remove();
        var len = results.rows.length;        
        
        var strHtmlHeader = "<li data-role='list-divider' role='heading'>Usuario&nbsp;:&nbsp;" + nombreUsuario + "</li>"
        $(strHtmlHeader).appendTo($('#lst_prod'));
       
        console.log("LISTAS len:" + len);
        if (len == 0){            
            strHtmlHeader = "<li data-theme='c'><a href='#' data-transition='slide'>No existen Listas</a></li>"; 
            $(strHtmlHeader).appendTo($('#lst_prod'));
        }
                   
        for (var i=0; i<len; i++){                       
            var strHtml = "<li data-theme='c'><a href='#listaCompetencias' onClick=\"javascript:queryGetCompetenciasByLista(" + results.rows.item(i).ID_LISTA + ",'" + results.rows.item(i).NOMBRE_LISTA +"') \" data-transition='slide'>" + results.rows.item(i).NOMBRE_LISTA + "<span class='ui-li-count ui-btn-up-c ui-btn-corner-all'>" +  results.rows.item(i).CANTIDAD + "</span></a></li>";            
                        
            $(strHtml).appendTo($('#lst_prod'));
        }                
        $.mobile.changePage("#listaPrecios",{ transition: "flip"});
        $('#lst_prod').listview('refresh');
    }

    function querySuccessCompetencia(tx, results) {
         $('#lst_comp').children().remove();
        
        var len = results.rows.length;
        console.log("COMPETENCIA table: " + len + " rows found.");
        
        var strHtmlHeader = "<li data-role='list-divider' role='heading'>" + nombreListaSel + "</li>"
        $(strHtmlHeader).appendTo($('#lst_comp'));
        
        for (var i=0; i<len; i++){            
            var strHtml = "<li data-theme='c'><a href='#listaProductos' onClick=\"javascript:queryGetProductos(" + results.rows.item(i).ID_COMPETENCIA + ",'" + results.rows.item(i).NOMBRE_COMPETENCIA + "') \" data-transition='slide'>" + results.rows.item(i).NOMBRE_COMPETENCIA + "<span class='ui-li-count ui-btn-up-c ui-btn-corner-all'>" +  results.rows.item(i).CANTIDAD + "</span></a></li>";            
            $(strHtml).appendTo($('#lst_comp')); 
            
            console.log("NOMBRE_COMPETENCIA : " + results.rows.item(i).NOMBRE_COMPETENCIA);

        }
        $('#lst_comp').listview('refresh');       
        
    }

    function querySuccessProductos(tx, results) {        
        $('#lst_sprod').children().remove();
    
        var len = results.rows.length;
        //console.log("PRODUCTOS table: " + len + " rows found.");
        
    
        listaProductosSel = new Array();
        
        var strHtmlHeader = "<li data-role='list-divider' role='heading'>" + nombreListaSel + " / " + nombreCompetenciaSel + "</li>"
        $(strHtmlHeader).appendTo($('#lst_sprod'));
        
        for (var i=0; i<len; i++){        
            
            listaProductosSel.push(results.rows.item(i));
            
            var strIcon = "alert";
            //console.log("ENCONTRADO" + results.rows.item(i).ENCONTRADO)
            if (results.rows.item(i).ENCONTRADO == 1){
                strIcon = "check";
            }
                        
            var strHtml = "<li data-theme='c' data-icon='" + strIcon + "'><a href='#detalleProducto' onClick=\"javascript:printDetalleProducto(" + i + ") \" data-transition='slide'  >" + results.rows.item(i).CODIGO_PRODUCTO + "  " +  results.rows.item(i).NOMBRE_PRODUCTO + "</a></li>"; 
                        
            $(strHtml).appendTo($('#lst_sprod'));
        }
        $('#lst_sprod').listview('refresh');
    }

    function querySuccessDetalleProducto(tx, results) {
        var len = results.rows.length;
        //console.log("DETALLE PRODUCTO table: " + len + " rows found.");
        for (var i=0; i<len; i++){  
            console.log("results.rows.item(i).DESCRIPCION_PRODUCTO:" + results.rows.item(i).DESCRIPCION_PRODUCTO);
            var strHtml = results.rows.item(i).DESCRIPCION_PRODUCTO;           
            $('#prod_desc').text(strHtml);    
            $('#nombreProducto').text(results.rows.item(i).NOMBRE_PRODUCTO);
            $('#nombreCompetencia').text(results.rows.item(i).NOMBRE_COMPETENCIA);
            $('#nombreLista').text(results.rows.item(i).NOMBRE_LISTA);
            
        }
        queryGetShoppingProductos();
    }

    function guardarNavegar(tipo){
        if (!validarFormulario)return;
        queryUpdateShoppingProductos(tipo);
        
        //if (tipo == "NEXT") irASiguiente();
        //if (tipo == "PREV") irAPrevio();
    
    }
    function irASiguiente(){        
        printDetalleProducto(rowIdSel + 1);
    }
    function irAPrevio(){       
        printDetalleProducto(rowIdSel - 1);
    }

    
    function limpiarForm(){
        $('#prod_desc').text("");    
        $('#nombreProducto').text("");
        $('#nombreCompetencia').text("");
        $('#nombreLista').text("");
        
        $('#txtPrecio').val("");
        $('#txtObservaciones').val(""); 

        if ($('#toggleEncontrado').val == 1){
            $('#toggleEncontrado').val("0").slider("refresh");
        }     
        $("#chkMismoPrecio").attr("checked",false).checkboxradio("refresh");
    }

    function printDetalleProducto(idRow) {        
        console.log("idRow:" + idRow);
        console.log("length:" + listaProductosSel.length);
        
        console.log("Tolerancia Mayor:" + mayorSel);
        console.log("Tolerancia Mayor:" + menorSel);
        console.log("length:" + listaProductosSel.length);
        
        
        //limpiarForm();
        
        if ((listaProductosSel.length <  (idRow + 1)) || idRow < 0)return; 
        
        if (listaProductosSel.length < (idRow + 2)){
             $('#btn_next').fadeTo('slow', 0.5);
        }else{
             $('#btn_next').fadeTo('slow', 1.0);
        }
        
        if (idRow <= 0){
            $('#btn_prev').fadeTo('slow', 0.5);
        }else{
            $('#btn_prev').fadeTo('slow', 1.0)
        }
        
        rowIdSel = idRow;
        var objProd = listaProductosSel[rowIdSel]; 
        idProductoSel = objProd.ID_PRODUCTO;        
        $('#prod_desc').text(objProd.DESCRIPCION_PRODUCTO);
        $('#nombreProducto').text(objProd.CODIGO_PRODUCTO + " " + objProd.NOMBRE_PRODUCTO);
        $('#nombreCompetencia').text(objProd.NOMBRE_COMPETENCIA);
        $('#nombreLista').text(objProd.NOMBRE_LISTA);
        $('#txtPrecio').val(objProd.PRECIO_ACTUAL);
        $('#txtObservaciones').val(objProd.OBSERVACION);  
        precioSodimacSel = objProd.PRECIO_SODIMAC;
        
        console.log("P1");       
        console.log("P2");
        try{
            $('#toggleEncontrado').val("1").slider("refresh");
            if (objProd.ENCONTRADO == 0){            
                $('#toggleEncontrado').val("0").slider("refresh");
            } 
        }catch(err){
            console.log("Error:" + err.message);
        }    
        console.log("P2");
        try{
            if (objProd.MISMO_PRECIO == 1){
                 $("#chkMismoPrecio").attr("checked",true).checkboxradio("refresh");
            }else{
                $("#chkMismoPrecio").attr("checked",false).checkboxradio("refresh");
            }    
        }catch(err){
            console.log("Error:" + err.message);
        } 
        console.log("P3");
        idProductoSel = objProd.ID_PRODUCTO; 
        console.log("PASO 20");
        queryGetShoppingProductos();
        console.log("PASO 21")
    }
    
    function querySuccessShoppingProducto(tx, results) {        
        $('#lst_shoppingProd').children().remove();
    
        var len = results.rows.length;
        console.log("SHOPPING PRODUCTOS table: " + len + " rows found.");
        
        var strHtmlHeader = "<li data-role='list-divider' role='heading'>Sodimac y Competencias</li>"
        strHtmlHeader += "<li data-theme='e'>Sodimac:&nbsp;$&nbsp;" + precioSodimacSel + "</li>"
        
        $(strHtmlHeader).appendTo($('#lst_shoppingProd'));
        
        for (var i=0; i<len; i++){   
           
            
            var sPrecioVigente = "0";            
            var sPrecioActual = "0";
            
            if (results.rows.item(i).PRECIO_VIGENTE != null)sPrecioVigente = results.rows.item(i).PRECIO_VIGENTE;
            if (results.rows.item(i).PRECIO_ACTUAL != null)sPrecioActual = results.rows.item(i).PRECIO_ACTUAL;
            
            /*
            var strHtml = "<li data-theme='c'>";
            strHtml = strHtml + "<H4>" + results.rows.item(i).NOMBRE_COMPETENCIA + "</H4>"; 
            strHtml = strHtml + "<div class='ui-grid-a'>"; 
            
            strHtml = strHtml + "<div class='ui-block-b'>"; 
            strHtml = strHtml + "<b>Vigente:</b>&nbsp;$&nbsp;" + sPrecioVigente + "";
            strHtml = strHtml + "</div>";
            strHtml = strHtml + "<div class='ui-block-c'>"; 
            strHtml = strHtml + "<b>Actual:</b>&nbsp;$&nbsp;" + sPrecioActual + "";
            strHtml = strHtml + "</div>";
            strHtml = strHtml + "</div>";
            strHtml = strHtml + "</li>";
            */ 
            
            var strHtml = "<li data-theme='c'>" + results.rows.item(i).NOMBRE_COMPETENCIA  + ":&nbsp;$&nbsp;" + sPrecioActual + "</li>"
            
            $(strHtml).appendTo($('#lst_shoppingProd'));            
        }
        $('#lst_shoppingProd').listview('refresh');
    }

    /*
    function querySuccessUpateShoppingProducto(tx, results) {

    }
     */


    // Transaction error callback
    //
    function errorCB(err) {
        console.log("Error processing SQL: "+err.code + ":" + err.message) ;
    }

    // Transaction success callback
    //
    function successUpdate() {
        console.log("successUpdate:Datos Guardados Exitosamente [tipoSave = " + tipoSave + "]");
        if (tipoSave == "SAVE"){
            alert("Datos Guardados Exitosamente.");
            queryGetShoppingProductos();
        }else{
            if (tipoSave == "NEXT"){
                irASiguiente();
            }
            if (tipoSave == "PREV"){
                irAPrevio();
            }    
        }    
        queryGetProductos(idCompetenciaSel,nombreCompetenciaSel);
    }

    function successUpdateNav() {        
        Console.log("successUpdateNav:Datos Guardados Exitosamente");
        //queryGetProductos(idCompetenciaSel,nombreCompetenciaSel);
    }

    function successInsertLista() {
        console.log("Lista Guardada Exitosamente");
        // queryGetShoppingProductos();
        // queryGetProductos(idCompetenciaSel,nombreCompetenciaSel);
    }

    function successInsertComp() {
       console.log("Competencia Guardada Exitosamente");
       // queryGetShoppingProductos();
       // queryGetProductos(idCompetenciaSel,nombreCompetenciaSel);
    }


    function successCB() {
        console.log("Datos sincronizados!");
        //var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
        //db.transaction(queryDB, errorCB);
    }

    // PhoneGap is ready
    //
    function initDataBase() {        
        var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);       
        db.transaction(populateDB, errorCB, successCB);
    }