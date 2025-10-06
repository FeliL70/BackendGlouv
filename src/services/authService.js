import supabase from '../configs/supabase.js';

export const loginUserService = async (email, password) => {
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('email', email)
      .eq('Contrasenia', password)
      .single();

    if (error || !data) return { error: "Email o contraseña incorrectos" };
    return { data };
  } catch (error) {
    console.error("Error en loginUserService:", error);
    return { error: "No se pudo iniciar sesión" };
  }
};

export const registerUserService = async (email, nombre, password) => {
  try {
    const { data: existingUser, error: lookupError } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (lookupError && lookupError.code !== 'PGRST116') throw lookupError;
    if (existingUser) return { error: "Ya existe un usuario con ese email" };

    const { data, error } = await supabase
      .from('Usuarios')
      .insert([{ email, nombre, Contrasenia: password }])
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error en registerUserService:", error);
    return { error: "No se pudo registrar el usuario" };
  }
};