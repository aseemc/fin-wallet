"use server";

import { createClient } from "@/lib/supabase/server";
import { ENABLED_VERTICALS, VALID_VERTICALS, type Vertical } from "@/lib/verticals";
import { redirect } from "next/navigation";

export async function setVertical(formData: FormData) {
  const vertical = formData.get("vertical") as string;

  if (!vertical || !VALID_VERTICALS.includes(vertical as Vertical)) {
    return { error: "Please select a valid vertical" };
  }

  if (!ENABLED_VERTICALS.has(vertical as Vertical)) {
    return { error: "This vertical is not yet available" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("users")
    .update({ vertical })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}
