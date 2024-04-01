import { Button } from "@/components/ui/button";
import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <Form action="/auth/discord" method="post">
      <Button>Login with Discord</Button>
    </Form>
  );
}