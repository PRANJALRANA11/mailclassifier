"use client"
import React from 'react'
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

export default function Home() {
  return (
    <Card className="mx-auto my-40 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your openai keys to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Keys</Label>
            <Input
              id="keys"
              type="password"
              placeholder="sk-....."
              required
            />
          </div>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
