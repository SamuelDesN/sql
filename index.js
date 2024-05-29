var mysql = require('mysql');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});




var conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "S1234567."
});


conexion.connect(function(err) {
  console.clear()
    if (err){
        console.log("Error")
        conexion.end()
    }
    else{
        console.log("Conectado al host "+conexion.config.host)
        conexion.query("CREATE DATABASE IF NOT EXISTS prueba ",function(err){
          if (err){
              console.log("Error")
              conexion.end()
          }
          else{
              conexion.query("USE prueba",function(err){
                  if (err){
                      console.log("Error, base de datos invalida")
                      conexion.end()
                  }
                  else{
                      console.log("Base de datos usada correctamente")
                      conexion.query("CREATE TABLE IF NOT EXISTS usuarios(nombre varchar(12), password varchar(10))",function(err){
                        if(err){
                            console.log("Error, tabla existente /// error de sintaxsis")
                            conexion.end()
                        }
                        else{"Tabla creada correctamente"}
                      })
                      conexion.query("select * from usuarios where nombre=\'Admin\'",function(err,result){
                        if(err){
                          console.log("Error")
                        }
                        else{
                          if(result.length>=1){
                            menuLogin()
                          }
                          else{conexion.query("insert into usuarios values ('Admin','123')",function(err){
                        if(err){
                            console.log("Error valores no validos / error de sintaxsis")
                            conexion.end()
                        }
                        else{
                            menuLogin()
                        }
                      }  
                    )}
                  }})
                    }
                }
              )
          }
        }
      )
    }
  }
)


function menuLogin(){
  console.log("Bienvenido a la pagina")
  rl.question("Introduzca su usuario: ",(usuario)=>{
    conexion.query("SELECT nombre from usuarios",function(err,result){
        if(err){
          console.log("\nError")
          conexion.end()
        }
        else{
          let error=0
          for(let i=0;i<result.length;i++){
            if(JSON.stringify(result[i].nombre)=='\"'+usuario+'\"'){
              console.log("Usuario correcto")
              rl.question("Introduzca su password: ", (contraseña)=>{
                conexion.query("SELECT * from usuarios",function(err,result){
                  if(err){
                    console.log("Error")
                  }
                  else{
                    for(let i=0;i<result.length;i++){
                    if(JSON.stringify(result[i].nombre)=='\"'+usuario+'\"' && JSON.stringify(result[i].password)=='\"'+contraseña+'\"'){
                      if(usuario=="Admin"){
                        menuAdmin()
                      }
                      else{
                        menuUsuarios()
                      }
                    }
                  }
                  }
                  }
                )
              }
            )
            }
            else{
              error+=1
              if(result.length==error){
                console.log("Usuario incorrecto")
                menuLogin()
              }
            }
          }
        }
      }
    )
  }
)}
function menuUsuarios(){
  console.clear()
  console.log("Opciones:")
  console.log("1. Agregar contacto")
  console.log("2. Modificar contacto")
  console.log("3. Borrar contacto")
  console.log("4. Mostrar agenda")
  console.log("5. Buscar contacto")
  console.log("6. Cerrar sesion")
  rl.question("Opcion: ",(respuesta)=>{
    switch(respuesta){
      case '1':
        crearContacto()
          break;
      case '2':
          modificarContacto()
          break;
      case '3':
          borrarContacto()
          break;
      case '4':
          mostrarAgenda()
          break;
      case '5':
          buscarContacto()
          break;
      case '6':
          menuLogin()
          break
      default:
          console.log("Opcion no valida")
          rl.question("",()=>{
            menuAdmin()
          })
      }
  })
}


function menuAdmin(){
  console.clear()
  console.log("¿Que desea realizar?")
  console.log("1. Crear usuario")
  console.log("2. Eliminar usuario")
  console.log("3. Mostrar usuarios")
  console.log("4. Acceder a la agenda del usuario")
  console.log("5. Cerrar sesion")
  rl.question("Opcion: ",(respuesta)=>{
    switch(respuesta){
      case '1':
        crearUsuario();
          break;
      case '2':
          eliminarUsuario();
          break;
      case '3':
          mostrarUsuarios();
          break;
      case '4':
          accederAgenda();
          break
      case '5':
          menuLogin();
          break;
      default:
          console.log("Opcion no valida");
          rl.question("Presiona Enter para continuar",()=>{
            menuAdmin()
          })
      }
  })
}
       
function crearUsuario(){
  console.clear()
  rl.question("\nIntroduzca su usuario: ",(usuario)=>{
    rl.question("Introduzca su contraseña: ",(contraseña)=>{
      rl.question("Quiere crear el usuario "+usuario+"? S/N ",(respuesta)=>{
        if(respuesta=='S'|| respuesta=='s'){
            conexion.query("insert into usuarios values(?,?)",[usuario,contraseña],function(err){
              if(err){
               console.log("Error")
              }
              else{
                conexion.query("CREATE TABLE ??(nombre varchar(12), password varchar(10))",[usuario],function(err){
                  if(err){
                    conexion.query("delete from usuarios WHERE nombre=?",[usuario],function(err){
                      if(err){
                      rl.question("Error crear tabla usuario ",(a)=>{
                        menuAdmin();
                      })}
                    })
                  }
                  else{
                    rl.question("Usuario creado correctamente presione enter para continuar",()=>{
                      menuAdmin()
                    });
                  }
                })
              }
            })
        }
        else{
          crearUsuario()
        }
      })
    })
  })
}


function mostrarUsuarios(){
  console.clear()
  conexion.query("select * from usuarios",function(err,result){
    if(err){
      console.log("Error")
    }
    else{
      console.log("Usuarios en la base de datos:")
      for(let i=0;i<result.length;i++){
        console.log(JSON.stringify(result[i].nombre))
      }
      rl.question("Presione enter para continuar",()=>{
        menuAdmin();
      })
   
  }})
}


function eliminarUsuario(){
  console.clear()
  conexion.query("select * from usuarios",function(err,result){
    if(err){
      console.log("Error")
    }
    else{
      for(let i=0;i<result.length;i++){
        console.log(JSON.stringify(result[i].nombre))}
      rl.question("¿Que usuario desea eliminar? ",(respuesta)=>{
        let usuario=result[(parseInt(respuesta)-1)].nombre
        conexion.query("select * from usuarios WHERE nombre=?",[usuario],function(err,result){
          if(err){
            console.log("Error")
            menuAdmin()
          }
          else{
            if(result.length==1){
              conexion.query("delete from usuarios where nombre=?",[usuario],function(err){
                if(err){
                  console.log("Error eliminar usuario")
                }
                console.log(usuario," fue eliminado correctamente\n")
                conexion.query("drop table ??",[usuario],function(err){
                  if(err){
                    console.log("Error eliminar tabla")
                  }
                  else{
                    console.log("Tabla",usuario,"eliminada correctamente")
                    rl.question("",()=>{
                      menuAdmin()
                    })
                  }
                })
              })
            }
            else{
              console.log("El nombre proporcionado no existe\n")
              rl.question("Presione enter para continuar",()=>{
                menuAdmin();
              })
            }
          }
        })
      })
    }
  })
}


function accederAgenda(){
  console.clear()
  conexion.query("select nombre from usuarios",function(err,result){
    if(err){
      console.log("Error")
    }
    else{
      for(let i=0;i<result.length;i++){
        console.log(JSON.stringify(result[i].nombre))
      }
      rl.question("\nSelecciona la agenda que quieres acceder: ",(usuario)=>{
        let agenda=(parseInt(usuario)-1)
        console.log(result[agenda])
      })
    }
  })
}

