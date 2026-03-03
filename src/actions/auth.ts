"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      name,
      email,
      role,
    });

    if (insertError) {
      return { error: insertError.message };
    }

    if (role === "client") {
      await supabase.from("financial_profiles").insert({
        user_id: data.user.id,
      });
    }
  }

  if (!data.session) {
    return { success: "Check your email to confirm your account, then sign in." };
  }

  redirect(role === "advisor" ? "/admin" : "/");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(role === "advisor" ? "/admin" : "/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
