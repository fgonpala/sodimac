var msgSync = "A"; 
var currentIdShopper = 0;



function loginWS(){
    var strUsuario = $('#txtUser').val().trim();
    var strClave = $('#txtPass').val().trim();  
    //cargarParametros();
    callLoginUsuario(strUsuario,strClave);
}

function getListasWS(){
    callGetListas(currentIdShopper);
}




function callLoginUsuario(usuario,clave){
    var valor = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ser='http://service.login.shopping.sodimac.cl/'>";
    valor += "<soapenv:Header/>";
    valor += "<soapenv:Body><ser:getAutentication><arg0>" + usuario + "</arg0><arg1>" + clave + "</arg1></ser:getAutentication></soapenv:Body></soapenv:Envelope>"; 
    
    
	$.ajax({ type: "POST",
           url: "http://" + hostParam +":" + portParam + "/shoppingPrecioInt/LoginPort",
           data: valor,
           contentType: "text/xml; charset=utf-8",
           dataType: "xml",
           cache: false,
           success: onSuccess,error: function (xhr, ajaxOptions, thrownError) {
           alert(xhr.status);
           alert(thrownError);
           }}); 
}

function callGetListas(idShopper){
    var valor = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ser='http://service.sincronizacion.shopping.sodimac.cl/'>"
    valor +="<soapenv:Header/><soapenv:Body><ser:getListasAsignadas><arg0>" + idShopper + "</arg0></ser:getListasAsignadas></soapenv:Body></soapenv:Envelope>"; 
    
    
	$.ajax({ type: "POST",
           url: "http://" + hostParam +":" + portParam + "/shoppingPrecioInt/ObtenerListasPort",
           data: valor,
           contentType: "text/xml; charset=utf-8",
           dataType: "xml",
           cache: false,
           success: onSuccessLista }); 
}

function createXmlMessageSync(tx, results){
    var len = results.rows.length;    
    var valor = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ser='http://service.sincronizacion.shopping.sodimac.cl/'>";
    valor += "<soapenv:Header/><soapenv:Body><ser:updateLista>";
    
    for (var i=0; i<len; i++){
        //if (results.rows.item(i).ENCONTRADO == 1){
            valor += "<arg0><idCompetencia>" + results.rows.item(i).ID_COMPETENCIA + "</idCompetencia>";
            valor += "<idLista>" + results.rows.item(i).ID_LISTA + "</idLista>";
            valor += "<idProducto>" + results.rows.item(i).ID_PRODUCTO + "</idProducto>";
            valor += "<precioActual>" + results.rows.item(i).PRECIO_ACTUAL + "</precioActual>";
            valor += "<mismoPrecio>" + results.rows.item(i).MISMO_PRECIO + "</mismoPrecio>"
            valor += "<encontrado>" + results.rows.item(i).ENCONTRADO + "</encontrado>"
            valor += "<observacion>" + results.rows.item(i).OBSERVACION + "</observacion>"
            valor += "</arg0>";
        //}    
    }
    valor += "</ser:updateLista></soapenv:Body></soapenv:Envelope>";   
    
    $.ajax({ type: "POST",
           url: "http://" + hostParam +":" + portParam + "/shoppingPrecioInt/ObtenerListasPort",
           data: valor,
           contentType: "text/xml; charset=utf-8",
           dataType: "xml",
           cache: false,
           success: onSuccessSync}); 
}


$("#resultLog").ajaxError(
                          function(event, request, settings, exception) {
                            console.log("ERROR WS:" + exception);
                          }
                          );

function onSuccessSync(data, status, req) {
    if (status == "success"){
        alert("Sincronizado exitosamente")
    }  

}



function onSuccess(data, status, req) {
    if (status == "success"){    	
        var sAutorizado = $(req.responseXML).find("autorizado").text();
        var sNombre = $(req.responseXML).find("nombreUsuario").text();
        var sIdShopper = $(req.responseXML).find("idShopper").text();
        var sIdUsuario = $(req.responseXML).find("idUsuario").text();


        console.log("sAutorizado:" + sAutorizado);
        console.log("sIdUsuario:" + sIdUsuario);
        console.log("sNombre:" + sNombre);
        console.log("sIdShopper:" + sIdShopper);
        
        nombreUsuario = sNombre;
        currentIdShopper = sIdShopper;
        
        queryInsertUsuario(sIdUsuario,sNombre);
        if (largoAux > 0){
            //eliminarDatos();
        }
        largoAux = 0;
        //queryGetListaPrecios();
        
        if (sAutorizado == "true"){
            callGetListas(sIdShopper);
            //$.mobile.changePage("#listaPrecios",{ transition: "flip"});
        }else{
            alert("Rut o Clave no corresponde");
        }    
        
        
    }
}

function onSuccessLista(data, status, req) {
    if (status == "success"){    	
        initDataBase();
        
        var listas = $(req.responseXML).find("listasAsiginadas");
        
        for (i=0;i<listas.length;i++){
            var objLista = listas[i];  
            
            //if (!verifyLista(objLista)) continue;
            if (!queryInsertListas(objLista)) continue;
              
            
            var listaComp = objLista.getElementsByTagName("competenciasAsignada");
            var idLista = objLista.getElementsByTagName("idLista")[0].childNodes[0].nodeValue;
            
            console.log("objLista:" + idLista);
            
            for (j=0;j<listaComp.length;j++){
                var objComp = listaComp[j];   
                var idCompetencia = objComp.getElementsByTagName("idCompetencia")[0].childNodes[0].nodeValue;
                
                queryInsertCompetencias(objComp,idLista);
                var listaProd = objComp.getElementsByTagName("productosAsignado");                
                
                for (k=0;k<listaProd.length;k++){                    
                    queryInsertProductos(listaProd[k],idCompetencia,idLista);
                }
                
                
            }
            
            
        } 
        queryGetListaPrecios();
    }
}

function queryGetListaPreciosParaSync(){   
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(queryDBSync, errorCB);
}

function queryDBSync(tx) {
    var strSql = "SELECT * FROM PRODUCTOS ORDER BY ID_LISTA,ID_COMPETENCIA";
    
    console.log("strSql:"+ strSql);        
    tx.executeSql(strSql, [], createXmlMessageSync, errorCB);
}

function getMessageSync(){    
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
   
    db.transaction(function(tx) {
                   var strSql = "SELECT * FROM PRODUCTOS ORDER BY ID_LISTA,ID_COMPETENCIA";
                   
                   tx.executeSql(strSql, [],function(tx, results)
                                 {
                                     console.log("-results:" + results.rows.length)
                                     //largoAux = results.rows.length;
                                     var valor = "";
                                     var len = results.rows.length;    
                                     valor += "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ser='http://service.sincronizacion.shopping.sodimac.cl/'>";
                                     valor += "<soapenv:Header/><soapenv:Body><ser:updateLista>";
                                     
                                     for (var i=0; i<len; i++){                        
                                         valor += "<arg0><idCompetencia>" + results.rows.item(i).ID_COMPETENCIA + "</idCompetencia>";
                                         valor += "<idLista>" + results.rows.item(i).ID_LISTA + "</idLista>";
                                         valor += "<idProducto>" + results.rows.item(i).ID_PRODUCTO + "</idProducto>";
                                         valor += "<precioActual>" + results.rows.item(i).PRECIO_ACTUAL + "</precioActual>";
                                         valor += "<mismoPrecio>" + results.rows.item(i).MISMO_PRECIO + "</mismoPrecio>"
                                         valor += "<encontrado>" + results.rows.item(i).ENCONTRADO + "</encontrado>"
                                         valor += "<observacion>" + results.rows.item(i).OBSERVACION + "</observacion>"
                                         valor += "</arg0>";                          
                                     }
                                     valor += "</ser:updateLista></soapenv:Body></soapenv:Envelope>";
                                     
                                     console.log("valor:" + valor);
                                 
                                     $.ajax({ type: "POST",
                                            url: "http://" + hostParam +":" + portParam + "/shoppingPrecioInt/ObtenerListasPort",
                                            data: valor,
                                            contentType: "text/xml; charset=utf-8",
                                            dataType: "xml",
                                            cache: false,
                                            success: onSuccessSync });
                                 }                                                   
                          );                             
                   });
                  
}  

function getMessageFin(){    
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    
    db.transaction(function(tx) {
                   var strSql = "SELECT * FROM PRODUCTOS ORDER BY ID_LISTA,ID_COMPETENCIA";
                   
                   tx.executeSql(strSql, [],function(tx, results)
                                 {
                                 console.log("-results:" + results.rows.length)
                                 //largoAux = results.rows.length;
                                 var valor = "";
                                 var len = results.rows.length;    
                                 valor += "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ser='http://service.sincronizacion.shopping.sodimac.cl/'>";
                                 valor += "<soapenv:Header/><soapenv:Body><ser:terminarProceso>";
                                 
                                 for (var i=0; i<len; i++){                        
                                     valor += "<arg0><idCompetencia>" + results.rows.item(i).ID_COMPETENCIA + "</idCompetencia>";
                                     valor += "<idLista>" + results.rows.item(i).ID_LISTA + "</idLista>";
                                     valor += "<idProducto>" + results.rows.item(i).ID_PRODUCTO + "</idProducto>";
                                     valor += "<precioActual>" + results.rows.item(i).PRECIO_ACTUAL + "</precioActual>";
                                     valor += "<mismoPrecio>" + results.rows.item(i).MISMO_PRECIO + "</mismoPrecio>"
                                     valor += "<encontrado>" + results.rows.item(i).ENCONTRADO + "</encontrado>"
                                     valor += "<observacion>" + results.rows.item(i).OBSERVACION + "</observacion>"
                                     valor += "</arg0>";                          
                                 }
                                 valor += "<arg1>" + currentIdShopper + "</arg1>"; 
                                 valor += "</ser:terminarProceso></soapenv:Body></soapenv:Envelope>";
                                 
                                 //console.log("valor:" + valor);
                                 
                                 $.ajax({ type: "POST",
                                        url: "http://" + hostParam +":" + portParam + "/shoppingPrecioInt/ObtenerListasPort",
                                        data: valor,
                                        contentType: "text/xml; charset=utf-8",
                                        dataType: "xml",
                                        cache: false,
                                        success: onSuccessFin });
                                 }                                                   
                                 );                             
                   });
    
} 

function syncronizar(){
    getMessageSync();  
}

function finalizar(){
    getMessageFin();  
}

function onSuccessFin(data, status, req) {
    if (status == "success"){
        eliminarDatos();
        alert("Proceso Finalizado exitosamente");
    }  
    
}

function eliminarDatos(){
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    
    db.transaction(function(tx) {  
                   tx.executeSql("DELETE FROM PRODUCTOS");
                   tx.executeSql("DELETE FROM COMPETENCIAS");
                   tx.executeSql("DELETE FROM LISTAS");                   
     });     
     queryGetListaPrecios();

     /*   
     $('#lst_prod').children().remove();
     var strHtmlHeader = "<li data-role='list-divider' role='heading'>Usuario&nbsp;:&nbsp;" + nombreUsuario + "</li>"
     $(strHtmlHeader).appendTo($('#lst_prod'));
    
     var strHtml = "<li data-theme='c'><a href='#listaCompetencias' data-transition='slide'>No existen Listas</a></li>";
     $(strHtml).appendTo($('#lst_prod'));        
     $('#lst_prod').listview('refresh');
      */
}

function cargarParametros(){
    queryGetParametros();
}

function agregarParametros(){
    var sHost = $('#txtHost').val();
    var sPort = $('#txtPort').val();
    
    queryInsertParametros(sHost,sPort); 
}

function iniciarAplicacion(){
    iniciarCamara();
    cargarParametros();
}
