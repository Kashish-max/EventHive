
import os
import base64
import imghdr
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.response import Response


# decode and save image
def decode_and_save_image(image, name):
    name = name.lower().replace(' ','-')
    try:
        image_binary = base64.b64decode(image)
    except Exception as e:
        return Response({"error": "Invalid image data format."}, status=400)

    image_format = imghdr.what(None, h=image_binary)
    if image_format is None:
        raise Exception("Invalid Image Format")

    name = name + "." + image_format
    return ContentFile(image_binary, name=name)

# delete image
def delete_image(image):
    if image:
        file_path = os.path.join(settings.MEDIA_ROOT, image.name)
        if default_storage.exists(file_path):
            default_storage.delete(file_path)