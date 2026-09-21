export const addProject = async ({ request }) => {
  const formData = await request.formData();

  const dataFromClient = Object.fromEntries(formData.entries());
  const imageFile = formData.get("image");

  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;

  const token = import.meta.env.VITE_SANITY_API_TOKEN;
  const imageUploadResponse = await fetch(
    `https://${projectId}.api.sanity.io/v1/assetsassets/images/production`,

    {
      method: "POST",
      headers: {
        "Content-Type": imageFile.type,
        Authorization: `Bearer ${token}`,
      },
      body: imageFile,
    }
  );

  const imageAsset = await imageUploadResponse.json();

  const slug = `${dataFromClient.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")}`;
  // -${Date.now()}

  try {
    await fetch(
      `https://${projectId}.api.sanity.io/v1/data/mutate/production`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mutations: [
            {
              create: {
                _type: "project",
                title: dataFromClient.title,
                description: dataFromClient.description,
                slug: {
                  _type: "slug",
                  current: slug,
                },
                image: {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: imageAsset.document._id,
                  },
                },
                projectUrl: dataFromClient.projectUrl,
                demoUrl: dataFromClient.demoUrl,
                skills: dataFromClient.skills,
                codeFiles: dataFromClient.codeFiles,
              },
            },
          ],
        }),
      }
    );

    return { success: true, message: "تم استلام البيانات بنجاح" };
  } catch (err) {
    console.log("Error processing form:", err);
    return { success: false, message: "حدث خطأ أثناء معالجة البيانات" };
  }
};
