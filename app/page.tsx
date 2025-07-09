import { redirect } from "next/navigation"

// The root page now redirects to the main trips list.
export default function Home() {
  redirect("/trips")
}
