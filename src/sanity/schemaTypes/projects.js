import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Project Image',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'projectUrl',
      title: 'Project GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'demoUrl',
      title: 'Project Demo URL',
      type: 'url',
    }),

    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Jupyter Notebooks', value: 'Jupyter Notebooks'},
          {title: 'Python', value: 'Python'},
          {title: 'Pandas', value: 'Pandas'},
          {title: 'NumPy', value: 'NumPy'},
          {title: 'Matplotlib', value: 'Matplotlib'},
          {title: 'Seaborn', value: 'Seaborn'},
        ],
      },
    }),

    defineField({
      name: 'codeFiles',
      title: 'Code Files (GitHub URLs)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            // {name: 'title', type: 'string', title: 'File Title'},
            {name: 'url', type: 'url', title: 'File URL'},
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
          },
        },
      ],
    }),

    // يمكنك إضافة حقل التاريخ إذا رغبت
    // defineField({
    //   name: 'date',
    //   title: 'Date',
    //   type: 'datetime',
    // }),
  ],
})
