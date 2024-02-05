<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::with('position')->get();

        return response()->json(['contacts' => $contacts], 200);
    }

    public function addContact(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'mobile_phone' => 'required',
            'email' => 'required|email',
            'sibnipi_email' => 'required|email',
            'position_id' => 'required|exists:positions,id',
        ]);

        $contact = Contact::create($validatedData);

        return response()->json(['contact' => $contact], 201);
    }

    public function show($id)
    {
        $contact = Contact::with('position')->find($id);

        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        return response()->json(['contact' => $contact], 200);
    }

    public function updateContact(Request $request, $id)
    {
        $validatedData = $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'mobile_phone' => 'required',
            'email' => 'required|email',
            'sibnipi_email' => 'required|email',
            'position_id' => 'required|exists:positions,id',
        ]);

        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        $contact->update($validatedData);

        return response()->json(['contact' => $contact], 200);
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json(['message' => 'Contact not found'], 404);
        }

        $contact->delete();

        return response()->json(['message' => 'Contact deleted successfully'], 200);
    }
}
